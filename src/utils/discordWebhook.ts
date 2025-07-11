
interface WebhookData {
  content?: string;
  embeds?: Array<{
    title?: string;
    description?: string;
    color?: number;
    fields?: Array<{
      name: string;
      value: string;
      inline?: boolean;
    }>;
    footer?: {
      text: string;
    };
    image?: {
      url: string;
    };
  }>;
}

export const sendDiscordWebhook = async (webhookUrl: string, data: WebhookData) => {
  try {
    console.log('Sending Discord webhook:', webhookUrl);
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Discord webhook failed: ${response.status}`);
    }

    console.log('Discord webhook sent successfully');
  } catch (error) {
    console.error('Error sending Discord webhook:', error);
    throw error;
  }
};
