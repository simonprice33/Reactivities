using Application.Errors;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Activities
{
    public class Details
    {
        public class Query : IRequest<Activity>
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


        public class Handler : IRequestHandler<Query, Activity>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<Activity> Handle(Query request, CancellationToken cancellationToken)
            {
                var activities = await _context.Activities.FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken).ConfigureAwait(false);

                if (activities == null)
                {
                    throw new RestException(HttpStatusCode.NotFound, "Database record not found");
                }

                return activities;
            }
        }
    }
}
