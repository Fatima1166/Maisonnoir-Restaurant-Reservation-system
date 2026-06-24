using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Configuration;

namespace MaisonNoirBackend.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task SendEmailAsync(string toEmail, string subject, string htmlMessage)
        {
            var smtpSettings = _configuration.GetSection("SmtpSettings");
            var host = smtpSettings.GetValue<string>("Host") ?? "smtp.gmail.com";
            var port = smtpSettings.GetValue<int>("Port", 587);
            var username = smtpSettings.GetValue<string>("Username") ?? "your-email@gmail.com";
            var password = smtpSettings.GetValue<string>("Password") ?? "your-app-password";
            var senderName = smtpSettings.GetValue<string>("SenderName") ?? "MaisonNoir";
            var senderEmail = smtpSettings.GetValue<string>("SenderEmail") ?? username;

            using (var client = new SmtpClient(host, port))
            {
                client.UseDefaultCredentials = false;
                client.Credentials = new NetworkCredential(username, password);
                client.EnableSsl = true;

                var mailMessage = new MailMessage
                {
                    From = new MailAddress(senderEmail, senderName),
                    Subject = subject,
                    Body = htmlMessage,
                    IsBodyHtml = true,
                };
                mailMessage.To.Add(toEmail);

                try
                {
                    await client.SendMailAsync(mailMessage);
                }
                catch (Exception ex)
                {
                    // Log error or handle as needed, for demo we'll just write to console
                    Console.WriteLine($"Error sending email: {ex.Message}");
                    throw; 
                }
            }
        }
    }
}
