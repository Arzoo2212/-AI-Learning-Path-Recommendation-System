using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace DTO
{
    public class UserDTO
    {
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string Email { get; set; }
       
        [Required]
        public string RoleName { get; set; }
        [Required]
        public int ExperienceLevel { get; set; }

        public string CareerGoal { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
