using AI_Course_Recommendation_System.Data;
using AI_Course_Recommendation_System.Models;
using AI_Course_Recommendation_System.Services;
using AutoMapper;
using DTO;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Moq;
using System;
using System.Collections.Generic;
using System.Text;
using Xunit;

namespace tests
{
    public class Login_ValidCredentials_ReturnToken

    {
        [Fact]
        public async Task Login_ValidCredentials_ShouldReturnToken()
        {
            
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase("LoginDb_Success_Final")
                .Options;

            var context = new ApplicationDbContext(options);

            var user = new User
            {
                Name = "Arzoo",
                Email = "test@test.com",
                Password = BCrypt.Net.BCrypt.HashPassword("123456"),
                UserRole = new UserRole { Name = "User" }
            };

            context.Users.Add(user);
            await context.SaveChangesAsync();

            var mockMapper = new Mock<IMapper>();
            mockMapper.Setup(m => m.Map<UserDTO>(It.IsAny<User>()))
                .Returns(new UserDTO { Email = user.Email });

            // JWT config (IMPORTANT)
            var config = new ConfigurationBuilder()
                .AddInMemoryCollection(new Dictionary<string, string>
                {
            {"JwtSettings:Secret", "THIS_IS_SECRET_KEY_123456789123456789"},
            {"JwtSettings:Issuer", "Test"},
            {"JwtSettings:Audience", "Test"}
                })
                .Build();

            var service = new AuthService(context, config, mockMapper.Object);

            var loginDto = new LoginRequestDTO
            {
                Email = "test@test.com",
                Password = "123456"
            };

            // Act
            var result = await service.LoginAsync(loginDto);

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(result.Token);
        }
    }
}
