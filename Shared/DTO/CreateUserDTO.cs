using System.ComponentModel.DataAnnotations;

namespace DTO
{
    public class CreateUserDTO
    {
        [Required]
        public string Name { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string RoleName { get; set; }   

        public int ExperienceLevel { get; set; }

        public string CareerGoal { get; set; } = string.Empty;
    }
}
