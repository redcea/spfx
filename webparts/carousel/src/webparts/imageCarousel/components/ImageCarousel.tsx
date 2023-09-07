import * as React from 'react';
import styles from './ImageCarousel.module.scss';
import { IImageCarouselProps } from './IImageCarouselProps';
import { escape } from '@microsoft/sp-lodash-subset';
/** Import from Demo */
import Carousel from 'react-bootstrap/Carousel';
import "bootstrap/dist/css/bootstrap.css";
import * as jQuery from 'jquery';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';

import { ISliderCarouselListItem, ISliderCarouselState } from './ISliderCarouselListItem';



export default class ImageCarousel extends React.Component<IImageCarouselProps, ISliderCarouselState> {

  constructor(props: IImageCarouselProps) {
    super(props);
    this.state = {
      value: []
    }
  }
  componentDidMount = () => {
    console.log("componentDidMount getCarouselListContent");
    this.getCarouselListContent();
  }

  private getCarouselListContent = () => {
    try {
      let requestUrl = `${this.props.absoluteURL}/_api/web/Lists/GetByTitle('${this.props.listName}')/Items`;
      this.props.spHttpClient.get(requestUrl, SPHttpClient.configurations.v1)
        .then((response: SPHttpClientResponse): Promise<ISliderCarouselState> => {
          if (response.ok) {
            return response.json();
          }
          else {
            return response.json();
          }
        })
        .then((item: ISliderCarouselState) => {
          if (item != null) {
            try {
              this.setState(({
                value: item.value
              }));
            }
            catch (err) {
            }
          }
        });
    } catch (error) {
      console.log('error in service ', error);
    }
  }


  private isStringEmptyOrNull(sString: string): boolean {
    let isEmpty: boolean = true;
    if (sString === null) {
      isEmpty = true;
    } else if (sString === undefined) {
      isEmpty = true;
    }
    else if (sString.trim().length === 0) {
      isEmpty = true;
    }
    else {
      isEmpty = false;
    }
    return isEmpty;
  }

  public render(): React.ReactElement<IImageCarouselProps> {
    let collection = this.state.value;
    console.log('Render Event Called');
    console.log(collection);
    const {
      slideSpeed,
      pauseCarousel
    } = this.props;
      return (
        <div className={styles.imageCarousel} >
          <Carousel pause={pauseCarousel ? 'hover' : false} interval={slideSpeed}>
            {
              collection.length > 0 && collection.map((data, index) => {
                if ((data.RedirectURL !== null) && (data.RedirectURL !== undefined)) {
                  return (
                    <Carousel.Item>
                      <a href={(data.RedirectURL !== undefined) ? data.RedirectURL['URL'] : ""}>
                        <img
                          className="d-block w-100"
                          src={JSON.parse(data.ImageURL).serverRelativeUrl}
                          alt={this.isStringEmptyOrNull(data.Title) ? "" : escape(data.Title)}
                        />
                      </a>
                    </Carousel.Item>
                  )
                } else {
                  return (
                    <Carousel.Item>
                      <img
                        className="d-block w-100"
                        src={JSON.parse(data.ImageURL).serverRelativeUrl}
                        alt={this.isStringEmptyOrNull(data.Title) ? "" : escape(data.Title)}
                      />
                    </Carousel.Item>
                  )
                }
              })
            }
          </Carousel>
        </div>
      );
  }
}
