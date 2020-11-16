using Application.Interfaces;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Activities
{
    public class Create
    {
        public class Command : IRequest
        {
            public Guid Id { get; set; }

            public string Title { get; set; }

            public string Description { get; set; }

            public string Category { get; set; }

            public DateTime Date { get; set; }

            public string City { get; set; }

            public string Venue { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(query => query.Title).NotEmpty();
                RuleFor(query => query.Description).NotEmpty();
                RuleFor(query => query.Category).NotEmpty();
                RuleFor(query => query.City).NotEmpty();
                RuleFor(query => query.Venue).NotEmpty();
                RuleFor(query => query.Date).NotEmpty().GreaterThanOrEqualTo(DateTime.Today);
            }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                _context = context;
                _userAccessor = userAccessor;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {

                var newActivity = new Activity
                {
                    Id = request.Id,
                    Category = request.Category,
                    City = request.City,
                    Date = request.Date,
                    Description = request.Description,
                    Title = request.Title,
                    Venue = request.Venue
                };

                await _context.Activities.AddAsync(newActivity, cancellationToken);

                var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetCurrentUserName(), cancellationToken: cancellationToken).ConfigureAwait(false);
                var attendee = new UserActivity
                {
                    AppUser = user,
                    Activity = newActivity,
                    IsHost = true,
                    DateJoined = DateTime.Now
                };

                await _context.UserActivities.AddAsync(attendee, cancellationToken);

                var success = await _context.SaveChangesAsync(cancellationToken) > 0;

                if (success)
                {
                    return Unit.Value;
                }

                throw new Exception("Problem saving changes");
            }
        }
    }
}
