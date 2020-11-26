import { Button, Card, Grid, Header, Image, Tab } from 'semantic-ui-react';
import React, { useContext, useState } from 'react';

import PhotoUploadWidget from '../../app/common/PhotoUpload/PhotoUploadWidget';
import { RootStoreContext } from '../../app/stores/rootStore';
import { loadavg } from 'os';
import { observer } from 'mobx-react-lite';

const ProfilePhotos = () => {
  const rootStore = useContext(RootStoreContext);
  const {
    profile,
    isCurrentUser,
    uploadPhoto,
    uploadingPhoto,
    setMain,
    loading,
    deletePhoto,
  } = rootStore.profileStore;
  const [addPhotoMode, setAddPhotoMode] = useState(false);
  const [target, setTarget] = useState<string | undefined>(undefined);
  const [deleteTarget, setDeleteTarget] = useState<string | undefined>(
    undefined
  );

  const handleUploadImage = (photo: Blob) => {
    uploadPhoto(photo).then(() => setAddPhotoMode(false));
  };
  return (
    <Tab.Pane>
      <Grid>
        <Grid.Column width={16} style={{ paddingBottom: 0 }}>
          <Header floated='left' icon='image' content='Photos' />
          {isCurrentUser && (
            <Button
              floated='right'
              basic
              onClick={() => setAddPhotoMode(!addPhotoMode)}
              content={addPhotoMode ? 'Cancel' : 'Add Photo'}
            />
          )}
        </Grid.Column>
        <Grid.Column width={16}>
          {addPhotoMode ? (
            <PhotoUploadWidget
              uploadPhoto={handleUploadImage}
              loading={uploadingPhoto}
            />
          ) : (
            <Card.Group itemsPerRow={5}>
              {profile?.photos.map((photo) => (
                <Card key={photo.id}>
                  <Image src={photo.url} />
                  {isCurrentUser && (
                    <Button.Group fluid widths={2}>
                      <Button
                        basic
                        positive
                        content='Main'
                        disabled={photo.isMain}
                        loading={loading && target === photo.id}
                        onClick={(e) => {
                          setTarget(e.currentTarget.name);
                          setMain(photo);
                        }}
                        name={photo.id}
                      />
                      <Button
                        onClick={(e) => {
                          setDeleteTarget(e.currentTarget.name);
                          deletePhoto(photo);
                        }}
                        name={photo.id}
                        loading={loading && deleteTarget === photo.id}
                        disabled={photo.isMain}
                        basic
                        negative
                        icon='trash'
                      />
                    </Button.Group>
                  )}
                </Card>
              ))}
            </Card.Group>
          )}
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
};

export default observer(ProfilePhotos);
