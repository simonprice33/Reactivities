using Application.Interfaces;
using Application.Photos;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using System;

namespace Infrastructure.Photos
{
    public class PhotoAccessor : IPhotoAccessor
    {
        private readonly Cloudinary _cloudinary;
        public PhotoAccessor(IOptions<CloudinarySettings> config)
        {
            var account = new Account(config.Value.CloudName, config.Value.ApiKey, config.Value.ApiSecret);

            _cloudinary = new Cloudinary(account);

        }
        public PhotoUploadResult AddPhoto(IFormFile file)
        {
            var uploadReult = new ImageUploadResult();

            if (file.Length > 0)
            {
                using var stream = file.OpenReadStream();
                var uploadParams = new ImageUploadParams
                {
                    File = new FileDescription(file.FileName, stream),
                    Transformation = new Transformation().Height(500).Width(500).Crop("fill").Gravity("face")
                };

                uploadReult = _cloudinary.Upload(uploadParams);
            }

            if (uploadReult.Error != null)
            {
                throw new Exception(uploadReult.Error.Message);
            }

            return new PhotoUploadResult
            {
                PublicPhotoId = uploadReult.PublicId,
                Url = uploadReult.SecureUrl.AbsoluteUri
            };
        }

        public string DeletePhoto(string photoId)
        {
            var deleteParams = new DeletionParams(photoId);
            var result = _cloudinary.Destroy(deleteParams);

            return result.Result == "ok" ? result.Result : null;
        }
    }
}
