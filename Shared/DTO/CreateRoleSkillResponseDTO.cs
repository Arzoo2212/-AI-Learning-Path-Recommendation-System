using System;
using System.Collections.Generic;
using System.Text;

namespace DTO
{
    public class CreateRoleSkillResponseDTO
    {
        public string RoleName { get; set; }

        public List<RoleSkillLevelResponseDTO> Skills { get; set; } = new();
    }
}
