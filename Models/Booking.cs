using System.ComponentModel.DataAnnotations;

namespace MaisonNoirBackend.Models
{
    public class Booking
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();

        [Required]
        public string UserId { get; set; } = string.Empty;

        [Required]
        public string UserName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string UserEmail { get; set; } = string.Empty;

        [Required]
        public string UserPhone { get; set; } = string.Empty;

        [Required]
        public string Date { get; set; } = string.Empty; // Format: YYYY-MM-DD

        [Required]
        public string Time { get; set; } = string.Empty; // Format: HH:mm

        [Required]
        public int Guests { get; set; }

        public string? TableNumber { get; set; }

        [Required]
        public string SeatingArea { get; set; } = "Indoor"; // "Indoor" | "Garden" | "Rooftop" | "VIP Lounge"

        [Required]
        public string Status { get; set; } = "pending"; // "pending" | "confirmed" | "cancelled" | "completed"

        public string? SpecialRequests { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
