using System;
using System.Collections.Generic;
using System.Text;

namespace AI_Course_Recommendation_System.DTO
{
    public class CreateRoleSkillResponseDTO
    {
        public string RoleName { get; set; }

        public List<RoleSkillLevelResponseDTO> Skills { get; set; } = new();
    }
}
