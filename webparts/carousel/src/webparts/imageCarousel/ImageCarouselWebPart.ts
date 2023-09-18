import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneDropdown,
  PropertyPaneChoiceGroup,
  PropertyPaneCheckbox,
  PropertyPaneSlider,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import * as strings from 'ImageCarouselWebPartStrings';
import ImageCarousel from './components/ImageCarousel';
import { IImageCarouselProps } from './components/IImageCarouselProps';

export interface IImageCarouselWebPartProps {
  description: string;
  listName: string;
  order: string;
  numberOfItems: number;
  uiLcid: number;
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
        order: this.properties.order,
        numberOfItems: this.properties.numberOfItems,
        uiLcid: this.properties.uiLcid,
        slideSpeed: this.properties.slideSpeed,
        pauseCarousel: this.properties.pauseCarousel,
        absoluteURL: this.context.pageContext.web.absoluteUrl,
        spHttpClient: this.context.spHttpClient,

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
                }),
                PropertyPaneChoiceGroup('order', {
                  label: strings.OrderFieldLabel,
                  options: [{
                    key: 'asc',
                    text: strings.OrderFieldAscendingOptionLabel,
                    checked: true
                  },
                  {
                    key: 'desc',
                    text: strings.OrderFieldDescendingOptionLabel
                  }
                  ]
                }),
                PropertyPaneSlider('numberOfItems', {
                  label: strings.NumberOfItemsFieldLabel,
                  min: 1,
                  max: 10,
                  step: 1,
                  value: 5,
                  showValue: true

                }),
                PropertyPaneDropdown('uiLcid', {
                  label: strings.LanguageFieldLabel,
                  options: [
                    {
                      key: 1033,
                      text: strings.EnglishOptionLabel
                    },
                    {
                      key: 1046,
                      text: strings.PortugueseOptionLabel
                    },
                    {
                      key: 3082,
                      text: strings.SpanishOptionLabel
                    }
                  ]

                })
              ]
            },
            {
              groupName: "Carousel Options",
              groupFields: [
                PropertyPaneSlider('slideSpeed', {
                  min: 2,
                  max: 7,
                  step: 1,
                  label: strings.slideSpeed,
                  showValue: true,
                  value: 5
                }),
                PropertyPaneCheckbox("pauseCarousel", {
                  checked: true,
                  text: strings.PauseCarouselOptionLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
  protected get disableReactivePropertyChanges(): boolean {
    return true;
  }

}
