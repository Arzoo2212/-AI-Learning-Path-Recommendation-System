using Xunit;
using Microsoft.EntityFrameworkCore;
using Moq;
using AutoMapper;

using AI_Course_Recommendation_System.Data;
using AI_Course_Recommendation_System.Models;
using AI_Course_Recommendation_System.Services;
using AI_Course_Recommendation_System.DTO;

public class DuplicateEmail
{
    [Fact]
    public async Task Register_Should_Fail_When_Email_Already_Exists()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase("TestDb2")
            .Options;

        var context = new ApplicationDbContext(options);

        // seed role
        context.UserRoles.Add(new UserRole { Name = "User" });

        // seed existing user
        context.Users.Add(new User
        {
            Name = "Test",
            Email = "test@test.com",
            Password = "123"
        });

        await context.SaveChangesAsync();

        var mockMapper = new Mock<IMapper>();
        mockMapper.Setup(m => m.Map<UserDTO>(It.IsAny<User>()))
            .Returns(new UserDTO());

        var service = new AuthService(context, null, mockMapper.Object);

        var dto = new CreateUserDTO
        {
            Name = "Arzoo",
            Email = "test@test.com",
            Password = "123456",
            RoleName = "Frontend"
        };

        await Assert.ThrowsAsync<Exception>(() => service.RegisterAsync(dto));
    }
}