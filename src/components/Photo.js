import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Image, Transformation } from 'cloudinary-react';
import { url } from '../utils/CloudinaryService';
import PhotoThumbnails from './PhotoThumbnails';
import {CloudinaryContext} from 'cloudinary-react';

class Photo extends Component {
    constructor(props) {
        super(props);
        this.state = { showMore: false };
    }

    render() {
        const options = { ...this.context, ...this.props };
        const urlPath = url(options.publicId, options);
        console.log(this.props)
        return (
            <div className="photo">
                {this.props.context && (
                    <h2>{this.props.context.custom.location}</h2>
                )}
                <a href={urlPath} target="_blank" rel="noopener noreferrer">
                    <Image
                        publicId={this.props.publicId}
                        className="thumbnail inline"
                        width="150"
                        height="150"
                        crop="fit"
                        quality="80"
                    >
                        <Transformation quality="auto" fetchFormat="auto" />
                    </Image>
                </a>
            </div>
        );
    }

    showMore() {
        this.setState({ showMore: true });
    }

    showLess() {
        this.setState({ showMore: false });
    }

    static contextType = CloudinaryContext.contextType;
}

Photo.propTypes = {
    context: PropTypes.object,
    publicId: PropTypes.string,
};

export default Photo;
