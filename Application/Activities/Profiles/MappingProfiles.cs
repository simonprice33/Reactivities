using Application.Activities.Dtos;
using AutoMapper;
using Domain;

namespace Application.Activities.Profiles
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<Activity, ActivityDto>();

            CreateMap<UserActivity, AtendeeDto>()
                .ForMember(dest => dest.DisplayName, opts => opts.MapFrom(src => src.AppUser.DisplayName))
                .ForMember(dest => dest.UserName, opts => opts.MapFrom(src => src.AppUser.UserName))
                .ForMember(dest => dest.IsHost, opts => opts.MapFrom(src => src.IsHost));
        }
    }
}
