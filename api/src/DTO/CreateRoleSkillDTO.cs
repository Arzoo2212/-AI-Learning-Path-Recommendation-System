using System;
using System.Collections.Generic;
using System.Text;

namespace AI_Course_Recommendation_System.DTO
{
    public class CreateRoleSkillDTO
    {
        public string RoleName { get; set; }

        public List<RoleSkillLevelDTO> Skills { get; set; } = new();
    }
}
