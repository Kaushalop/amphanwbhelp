import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { openUploadWidget } from '../utils/CloudinaryService';
import { photosUploaded } from '../actions';
import Photo from './Photo';
import Introduction from './Introduction';
import {CloudinaryContext} from 'cloudinary-react';

class PhotoList extends Component {
    render() {
        return (
            <div className="photoList">
                <Introduction />
                <h1> Please see all photos of our state and city and the latitude and longitude for the same to give help</h1>
                <div className="actions">
                    <NavLink className="upload_link" exact to="/photos/new">
                        Upload Photo of your location
                    </NavLink>
                </div>
                <div className="photos">
                    {this.props.photos.length === 0 && (
                        <p>No photos were added yet.</p>
                    )}
                    {this.props.photos.map(photo => {
                        return (
                            <Photo
                                key={photo.public_id}
                                publicId={photo.public_id}
                                context={photo.context}
                            />
                        ); 
                    })}
                </div>
            </div>
        );
    }

    uploadImageWithCloudinary() {
        const uploadOptions = { tags: 'myphotoalbum', ...this.context };
        openUploadWidget(uploadOptions, (error, photos) => {
            if (!error) {
                this.props.onPhotosUploaded(photos);
            } else {
                console.log(error);
            }
        });
    }

    static contextType = CloudinaryContext.contextType;
}

PhotoList.propTypes = {
    photos: PropTypes.array,
    onPhotosUploaded: PropTypes.func,
};

const PhotoListContainer = connect(
    state => ({ photos: state.photos }),
    {
        onPhotosUploaded: photosUploaded,
    }
)(PhotoList);

Object.assign(PhotoListContainer.contextTypes, PhotoList.contextTypes);

export default PhotoListContainer;
