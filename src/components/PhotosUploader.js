import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import request from 'superagent';
import Dropzone from 'react-dropzone';
import { photosUploaded, updateUploadedPhoto } from '../actions';
import UploadedPhotoStatusContainer from './UploadedPhotosStatus';
import {CloudinaryContext} from "cloudinary-react";

class PhotosUploader extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = { uploadedPhotos: [] };
        this.photoId = 1;
        this.locationMiddleware = this.locationMiddleware.bind(this)
        this.onPhotoSelected = this.onPhotoSelected.bind(this)
    }

    render() {
        return (
            <div>
                <Dropzone
                    id="direct-upload-dropzone"
                    disableClick={true}
                    multiple={false}
                    accept="image/*"
                    style={{ position: 'relative' }}
                    onDrop={this.locationMiddleware.bind(this)}
                >
                    <div id="direct_upload">
                        <h1>New Photo</h1>
                        <h2>
                            Direct upload from the browser with React File
                            Upload
                        </h2>
                        <p>
                            You can also drag and drop an image file into the
                            dashed area.
                        </p>
                        <form>
                            <div className="form_line">
                                <label path="title">Put your location:</label>
                                <div className="form_controls">
                                    <input
                                        type="text"
                                        ref={titleEl =>
                                            (this.titleEl = titleEl)
                                        }
                                        className="form-control"
                                        placeholder="Title"
                                    />
                                </div>
                            </div>
                            <div className="form_line">
                                <label>Image:</label>
                                <div className="form_controls">
                                    <div className="upload_button_holder">
                                        <label
                                            className="upload_button"
                                            htmlFor="fileupload"
                                        >
                                            Upload
                                        </label>
                                        <input
                                            type="file"
                                            id="fileupload"
                                            accept="image/*"
                                            multiple="multiple"
                                            ref={fileInputEl =>
                                                (this.fileInputEl = fileInputEl)
                                            }
                                            onChange={() =>
                                                this.locationMiddleware(
                                                    this.fileInputEl.files
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        </form>
                        <h2>Status</h2>
                    </div>
                    {this.props.uploadedPhotos.map((uploadedPhoto, index) => {
                        return (
                            <UploadedPhotoStatusContainer
                                key={index}
                                uploadedPhoto={uploadedPhoto}
                            />
                        );
                    })}
                </Dropzone>

                <NavLink className="back_link" exact to="/photos">
                    Back to list
                </NavLink>
            </div>
        );
    }

    onPhotoSelected(files, position) {
        let pos = position.coords.latitude.toString() + ' , ' + position.coords.longitude.toString()
        console.log(pos)
        const url = `https://api.cloudinary.com/v1_1/${
            this.context.cloudName
            }/upload`;
        const title = this.titleEl.value;
        console.log(typeof(title))
        console.log('now 1')
        

        for (let file of files) {
            const photoId = this.photoId++;
            const fileName = file.name;
            console.log('now 2')
            console.log(pos)
            request.post(url)
                .field('upload_preset', this.context.uploadPreset)
                .field('file', file)
                .field('multiple', true)
                .field('tags', title ? `myphotoalbum,${title}` : 'myphotoalbum')
                .field('context', `location=${pos}`)
                .on('progress', (progress) => this.onPhotoUploadProgress(photoId, file.name, progress))
                .end((error, response) => {
                    this.onPhotoUploaded(photoId, fileName, response);
                });
        }
    }

    locationMiddleware(files) {
        console.log(' in location middleware')
        navigator.geolocation.getCurrentPosition((position) => {
            let pos = position.coords.latitude.toString() + ' , ' + position.coords.longitude.toString()
        console.log(pos)
        const url = `https://api.cloudinary.com/v1_1/${
            this.context.cloudName
            }/upload`;
        const title = this.titleEl.value;
        console.log(typeof(title))
        console.log('now 1')
        

        for (let file of files) {
            const photoId = this.photoId++;
            const fileName = file.name;
            console.log('now 2')
            console.log(pos)
            request.post(url)
                .field('upload_preset', this.context.uploadPreset)
                .field('file', file)
                .field('multiple', true)
                .field('tags', title ? `myphotoalbum,${title}` : 'myphotoalbum')
                .field('context', `location=${pos}`)
                .on('progress', (progress) => this.onPhotoUploadProgress(photoId, file.name, progress))
                .end((error, response) => {
                    this.onPhotoUploaded(photoId, fileName, response);
                });
        }
        })
    }

    alerti() {
        alert('asldkamsldkm')
    }


    onPhotoUploadProgress(id, fileName, progress) {
        this.props.onUpdateUploadedPhoto({
            id: id,
            fileName: fileName,
            progress: progress,
        });
    }

    onPhotoUploaded(id, fileName, response) {
        this.props.onUpdateUploadedPhoto({
            id: id,
            fileName: fileName,
            response: response,
        });

        this.props.onPhotosUploaded([response.body]);
    }

    static contextType = CloudinaryContext.contextType;
}

PhotosUploader.propTypes = {
    uploadedPhotos: PropTypes.array,
    onUpdateUploadedPhoto: PropTypes.func,
    onPhotosUploaded: PropTypes.func,
};

const PhotosUploaderContainer = connect(
    state => state,
    {
        onUpdateUploadedPhoto: updateUploadedPhoto,
        onPhotosUploaded: photosUploaded,
    }
)(PhotosUploader);

Object.assign(
    PhotosUploaderContainer.contextTypes,
    PhotosUploader.contextTypes
);

export default PhotosUploaderContainer;
