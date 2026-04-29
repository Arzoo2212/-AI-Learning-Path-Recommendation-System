using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace AI_Course_Recommendation_System.DTO
{
    public class RegisterRequestDTO
    {
        [Required]
        [MaxLength(100)]
        public required string Name { get; set; }

        [Required]
        [EmailAddress]
        public required string Email { get; set; }

       

        [Required]
        public required string Password { get; set; }

    }
}
