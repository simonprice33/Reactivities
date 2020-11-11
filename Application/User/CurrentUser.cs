using Application.Errors;
using Application.Interfaces;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Persistence;
using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;

namespace Application.User
{
    public class CurrentUser
    {
        public class Query : IRequest<User>
        {
            public Guid Id { get; set; }
        }

        public class QueryValidator : AbstractValidator<Query>
        {
            private readonly DataContext _context;

            public QueryValidator(DataContext contex)
            {
                _context = contex;
                RuleFor(query => query.Id).NotEmpty();
            }
        }


        public class Handler : IRequestHandler<Query, User>
        {
            private readonly UserManager<AppUser> _userManager;
            private readonly IJwtGenerator _jwtGenerator;
            private readonly IUserAccessor _userAccessor;
            private readonly DataContext _context;
            public Handler(UserManager<AppUser> userManager, IJwtGenerator jwtGenerator, IUserAccessor userAccessor)
            {
                _userManager = userManager;
                _jwtGenerator = jwtGenerator;
                _userAccessor = userAccessor;
            }

            public async Task<User> Handle(Query request, CancellationToken cancellationToken)
            {
                var user = await _userManager.FindByNameAsync(_userAccessor.GetCurrentUserName());

                if (user == null)
                {
                    throw new RestException(HttpStatusCode.NotFound, "Database record not found");
                }

                return new User
                {
                    DisplayName = user.DisplayName,
                    Username = user.UserName,
                    Token = _jwtGenerator.CreateToken(user),
                    Image = null
                };
            }
        }
    }
}
