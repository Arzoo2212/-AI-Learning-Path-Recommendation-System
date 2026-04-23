using System;
using System.Collections.Generic;
using System.Text;

namespace DTO
{
    public class UserDTO
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string Email { get; set; }

        public string RoleName { get; set; }  

        public int ExperienceLevel { get; set; }

        public string CareerGoal { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
