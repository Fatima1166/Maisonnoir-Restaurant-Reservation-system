using System.ComponentModel.DataAnnotations;

namespace MaisonNoirBackend.Models
{
    public class MenuItem
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();

        [Required]
        public string Name { get; set; } = string.Empty;

        [Required]
        public string Description { get; set; } = string.Empty;

        [Required]
        public decimal Price { get; set; }

        [Required]
        public string Category { get; set; } = "main"; // "appetizer" | "main" | "dessert" | "beverage" | "special"

        [Required]
        public string Image { get; set; } = string.Empty;

        [Required]
        public bool Vegetarian { get; set; }

        [Required]
        public bool IsAvailable { get; set; } = true;
    }
}
