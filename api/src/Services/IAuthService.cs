using DTO;

namespace AI_Course_Recommendation_System.Services
{
    public interface IAuthService
    {
        Task<UserDTO?> RegisterAsync(CreateUserDTO dto);

        Task<LoginResponseDTO?> LoginAsync(LoginRequestDTO dto);

        Task<bool> IsEmailExistsAsync(string email);
    }
}
