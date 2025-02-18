import { Context } from '../../../../../types/contextType';

export default {
  getUserToken: async (_: any, args: any, ctx: Context) => {
    const messages = await ctx.outLookClient.getMailList(
      'EwCAA8l6BAAU6k7+XVQzkGyMv7VHB/h4cHbJYRAAASSRNy/fGM1aQbbNWkTES+7M+ERHzHIkJhxFacbjmYTU7MisEEAJnX4jR5VySkX/UEGFZKpR8LVNXIk1XE2Ura6xWr/kOoq4GFTGYH+yV/A6lexg7B+mEFg77D6TYzyQYx5LLs7AUjJmo1Kni4eVvjKFMveL64MZMRmUFsWHNLgLJ0YVcYYTEfreqb8l+BPw1tmZrXqtQBVt5goAFiyvgfn2eHb8k+mX1H408SlyKKPuHybn5P1MdPeV6ywjo4ylhgo2nq1JB3Y0AQJKhi2K6FkBhssWPygx79Euhz2V50n20krRTq+OeD55m5luk7lfQRhC9AkBQpQ+jY0a2Mn6ol4DZgAACB06sCGRMFPuUAJq7+z7TJSdS6c0ifuXxQtst7NQKv26AecJImeHlyfkhDZTVH4pq+/gaVs1Etx+XgxC43dlyO7Y5GqKvvVZeZ5/3kx11zeXWhVIx3IG2JqpsuoU++KPSzfllbLNkD+QX/95N15Ae5fLRnOlefUDN6DPVFQqd7OHd2Q0vEPaSmKQDVaQiHeuHAvqrDvTXLye3ssjppEKbQL9EfCGlk1b+SeXHxK3Miyf6sMna/KWzBpyk4JMSxwv+WKpbJXkdBHxUmSr3nttvq+iPeV95TWClcqBlnNgi55NkhZZr8jiRQqexFuSUO2DIcmpIQJr1aJc62HJ8t4dja/tgbQBVSV7DWcNLHlOQO1AQCv6B2bmaj+hbyuRLv0PQNxT8zPPukOSiEQvjnNwf7aJSEYccppQomEDL+1mItl5vY9ZSw3+Iz/rj0VEJOcOzj504fg7cYWnaG73Ks+rxOCFVBd1Bzd7HzmD2r0xO45M5gL0+uZWeUzX/nqx2y3mqF25a3hTiOHeoLPp1c5Ng8Fmsw1fdx35lu7ssUZNT7YDt5f93jBmu9n86UTjU4j0blILhdZdafzQnANdi5r7duNjdb4ONYEF09fCt14BRbGRWCntB9M+q6t7as4Fy1sxsWDFFaVduVypFrZFLJ5pKr9s0zxE1NaoWLuSnRQdNK74PFYSYi73Lathm5VN9OWTFHk7wfjfVcEbbSVthjsk99pt34Q8HcFcoZK5LXfihCbwEOaqb206ztkgGNu0sRuJRR75xIZ94D8piSFT/QHkviDAbkxplp6npkZ3ngI=',
      new Date().toISOString(),
    );

    console.log('messages', messages);
    return 'token';
  },
};
