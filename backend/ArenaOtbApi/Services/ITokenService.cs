using ArenaOtbApi.Models;

namespace ArenaOtbApi.Services;
public interface ITokenService
{
    string GenerateToken(User user);
}