import * as React from 'react';
import styles from './ImageCarousel.module.scss';
import Carousel from 'react-bootstrap/Carousel';
import "bootstrap/dist/css/bootstrap.css";
import { escape } from '@microsoft/sp-lodash-subset';

function CreateCarouselCaption(props) {
   
    if (props.Title === undefined && props.Description === undefined) {
        return (
            <Carousel.Caption className="d-none"/>
        );
    }
    else {
        return (
            <Carousel.Caption className="d-none d-md-block">
                    {(props.Title !== undefined)? <h5>{escape(props.Title)}</h5>: ""}
                    {(props.Description !== undefined)? <p>{escape(props.Description)}</p>: ""}
            </Carousel.Caption>
        );
    }//else 

}
export default CreateCarouselCaption;