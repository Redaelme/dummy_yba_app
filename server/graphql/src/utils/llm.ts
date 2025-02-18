import axios from "axios";

export const CheckIfMeetingRequest = async (
    body: string,
    userId: string,
    timezone: string,
    date: string,
    time: string,
    emailType: string,
    sender: string,
    recipient: string,
    subject: string,
    messageID: string,
    referenceID: string,
    proposedSlots: string,
    confirmedDate: string,
    emailDate?: string,
) => {
    try {
        // console.log('sending email to ml server', process.env.LLMLINK);
        // console.log('from llm request [[body]]', body);
        const meetingRequest = {
            availability: [
                {
                    end_date: "17/09/2024",
                    end_time: "",
                    location: "",
                    meeting_duration: "30 minutes",
                    meeting_type: "standard",
                    start_date: "17/09/2024",
                    start_time: "15:00",
                    time_zone: ""
                }
            ],
            is_meetingrequest: true,
            language: "French",
            meeting_title: "Meeting test number " + Math.floor(Math.random() * 100),
            sentiment: "positive",
            tone: "neutral",
            user_id: userId
        };
        const fakeResponse = {
            "language": "English",
            "participant_response": "Accepted",
            "sentiment": "Positive",
            "tone": "casual",
            "user_id": userId, "emailType": emailType, "sender": sender, "messageID": messageID, "referenceID": referenceID, "proposedSlots": proposedSlots,
            "availability": [
                {
                    "start_date": "01/09/2024",
                    "end_date": "31/09/2024",
                    "location": "None",
                    "time_zone": "None",
                    "meeting_duration": "None",
                    "start_time": "10:30",
                    "end_time": "10:45",
                    "meeting_type": "Standard"
                },
                {
                    "start_date": "",
                    "end_date": "",
                    "location": "None",
                    "time_zone": "None",
                    "meeting_duration": "None",
                    "start_time": "",
                    "end_time": "",
                    "meeting_type": "Standard"
                }
            ]
        };
        // return meetingRequest;

        const response = await axios.post(process.env.LLMLINK || "", {
            query: `
                query getEmailDetails($emailContent: String!, $timezone: String!, $date: String!, $time: String!, $emailType: String!, $sender: String!, $recipient: String!, $subject: String!, $messageID: String!, $referenceID: String!, $proposedSlots: String!, $confirmedDate: String!, $emailDate: String) {
                    user_id
                    timezone
                    email_address
                    email_content
                    is_meetingrequest
                    meeting_title
                    tone
                    reserve_room
                    sentiment
                    approximate_schedule
                    availability {
                        date
                        available_free_start_time
                        location
                        time_zone
                        available_free_end_time
                        explicit_meeting_request_duration_in_email
                    }
                }
            `,
            variables: {
                timezone,
                date,
                time,
                emailContent: body,
                emailType,
                sender,
                recipient,
                subject,
                messageID,
                referenceID,
                proposedSlots,
                confirmedDate,
                emailDate,
            }
        });
        // console.log('from llm response', body, response.data);
        const jsonres = JSON.parse(JSON.stringify(response.data).replace(/"None"/g, '""'));
        if (emailType === 'reply')  return {...jsonres, user_id: userId, emailType: emailType, sender: sender, messageID: messageID, referenceID: referenceID, proposedSlots: proposedSlots};
        return {...jsonres, user_id: userId};
    } catch (error) {
        console.error("Error:", error);
        throw error;  // Re-throw the error to handle it outside
    }
};
