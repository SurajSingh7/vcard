// lib/sendWhatsAppMessage.js
export const sendWhatsAppMessageDynamic = async (name, mobileNumber,dynamicNumber) => {
    try {
      if (!process.env.WHATSAPP_API_URL || !process.env.WHATSAPP_API_KEY) {
        console.error("WhatsApp API or API Key not found");
        return;
      }
      if (!mobileNumber) {
        console.error("Mobile number not provided");
        return;
      }
      const response = await fetch(process.env.WHATSAPP_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          apiKey: process.env.WHATSAPP_API_KEY,
          campaignName: "Convergence2",
          destination: `+91${mobileNumber}`,
          userName: name || "Subscriber",
          templateParams: [`${dynamicNumber}`],
          media: {
            url: "https://whatsapp-media-library.s3.ap-south-1.amazonaws.com/FILE/6600405a0dee457cf7835ca1/5841109_WibroBrochurecompressed.pdf",
            filename: "Wibro Brochure",
          },
        }),
      });
      console.log("WhatsApp message sent successfully:", response);
      return response;
    } catch (error) {
      console.error(
        "Error sending WhatsApp message:",
        error.response ? error.response.data : error.message
      );
    }
  };
  