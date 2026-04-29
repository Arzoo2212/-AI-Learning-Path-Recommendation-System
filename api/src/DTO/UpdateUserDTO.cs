using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace AI_Course_Recommendation_System.DTO
{
    public class UpdateUserDTO
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
