import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneCheckbox,
  PropertyPaneSlider,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import * as strings from 'ImageCarouselWebPartStrings';
import ImageCarousel from './components/ImageCarousel';
import { IImageCarouselProps } from './components/IImageCarouselProps';
import { labelProperties } from 'office-ui-fabric-react';

export interface IImageCarouselWebPartProps {
  description: string;
  listName: string;
  slideSpeed: number;
  pauseCarousel: boolean;
  absoluteURL: any;
  spHttpClient: any;
}

export default class ImageCarouselWebPart extends BaseClientSideWebPart<IImageCarouselWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IImageCarouselProps> = React.createElement(
      ImageCarousel,
      {
        description: this.properties.description,
        listName: this.properties.listName,
        slideSpeed: this.properties.slideSpeed,
        pauseCarousel: this.properties.pauseCarousel,
        absoluteURL: this.context.pageContext.web.absoluteUrl,
        spHttpClient: this.context.spHttpClient
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('listName', {
                  label: strings.ListName
                })
              ]
            },
            {
              groupName: "Carousel Options",
              groupFields: [                
                PropertyPaneSlider('slideSpeed', {
                  min: 500,
                  max: 7000,
                  step: 1,
                  label: strings.slideSpeed,
                  showValue: true,
                  value: 5000
                }),
                PropertyPaneCheckbox("pauseCarousel",{
                  checked: true,
                  text: "Pauses the carousel when the mouse pointer enters the carousel"
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
