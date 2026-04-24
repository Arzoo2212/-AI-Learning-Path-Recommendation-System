using Xunit;
using Microsoft.EntityFrameworkCore;
using Moq;
using AutoMapper;

using AI_Course_Recommendation_System.Data;
using AI_Course_Recommendation_System.Models;
using AI_Course_Recommendation_System.Services;
using DTO;

public class RegisterTest
{
    [Fact]
    public async Task Register_User_Should_Work()
    {
        // Fake DB
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase("TestDb1")
            .Options;

        var context = new ApplicationDbContext(options);

        // Seed role
        context.UserRoles.Add(new UserRole { Name = "User" });
        await context.SaveChangesAsync();

        // 🔥 Mock mapper
        var mockMapper = new Mock<IMapper>();

        mockMapper
            .Setup(m => m.Map<UserDTO>(It.IsAny<User>()))
            .Returns((User u) => new UserDTO
            {
                Name = u.Name,
                Email = u.Email
            });

        var service = new AuthService(context, null, mockMapper.Object);

        var dto = new CreateUserDTO
        {
            Name = "Arzoo",
            Email = "test@test.com",
            Password = "123456",
            RoleName = "Frontend"
        };

        var result = await service.RegisterAsync(dto);

        Assert.NotNull(result);
        Assert.Equal("test@test.com", result.Email);
    }
}