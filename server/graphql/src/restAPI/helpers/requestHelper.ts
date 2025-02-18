import 'cross-fetch/polyfill';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-client';
import { SubscriptionConfiguration } from '../../types/types';
import * as cronJob from 'node-cron';

export class SubscriptionManagementService {
  accessToken: string;
  subscriptionPath: string;
  constructor(accessToken: string) {
    this.accessToken = accessToken;
    this.subscriptionPath = '/subscriptions';
  }

  getGraphClient() {
    const client = MicrosoftGraph.Client.init({
      authProvider: (done) => {
        done(null, this.accessToken);
      },
    });
    return client;
  }

  async deleteSubscription(subscriptionId: string) {
    const client = this.getGraphClient();
    await client.api(`${this.subscriptionPath}/${subscriptionId}`).delete();
  }

  async createSubscription(subscriptionCreationInformation: SubscriptionConfiguration) {
    const client = this.getGraphClient();
    console.log('enter after get client');
    const subscription = await client
      .api(this.subscriptionPath)
      .version('beta')
      .create(subscriptionCreationInformation);
    console.log('calling API beta version');
    return subscription;
  }

  async updateSubscription(
    subscriptionId: string,
    updateSubscriptionDateTime: Date,
    accessToken: string,
  ) {
    const min = updateSubscriptionDateTime.getMinutes();
    const hour = updateSubscriptionDateTime.getHours();
    const date = updateSubscriptionDateTime.getDate();
    const month = updateSubscriptionDateTime.getMonth();
    cronJob.schedule(`${min} ${hour} ${date} ${month + 1} *`, async () => {
      const newExpirationDateTime = new Date(Date.now() + 253800000).toISOString();
      const updateDataSub = {
        expirationDateTime: newExpirationDateTime,
        changedType: 'updated',
      };
      const client = MicrosoftGraph.Client.init({
        authProvider: (done) => {
          done(null, accessToken);
        },
      });
      const updateSub = await client
        .api(`${this.subscriptionPath}/${subscriptionId}`)
        .version('beta')
        .update(updateDataSub);
      console.log('Successfully updated subscription');
      if (updateSub) {
        const updateSubDateTime = new Date(Date.now() + 253500000);
        await this.updateSubscription(subscriptionId, updateSubDateTime, accessToken);
      }
    });
  }

  async listSubscription() {
    const client = this.getGraphClient();
    const subscriptionList = await client.api(this.subscriptionPath).version('beta').get();
    return subscriptionList.value;
  }

  async getData(path: string) {
    const client = this.getGraphClient();
    const result = await client
      .api(path)
      .headers({
        'Content-Type': 'application/json',
        Accept:
          'application/json;odata.metadata=minimal;' +
          'odata.streaming=true;IEEE754Compatible=false',
      })
      .get();
    return result;
  }
}
