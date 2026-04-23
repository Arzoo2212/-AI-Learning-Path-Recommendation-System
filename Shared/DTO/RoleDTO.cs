

using System.ComponentModel.DataAnnotations;

namespace DTO
{
    public class RoleDTO
    {
        [Required]
        public required string Name { get; set; }
    }
}
