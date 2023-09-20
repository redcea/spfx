import * as React from 'react';
import styles from './ImageCarousel.module.scss';
import { IImageCarouselProps } from './IImageCarouselProps';
import { escape } from '@microsoft/sp-lodash-subset';
/** Import from Demo */
import Carousel from 'react-bootstrap/Carousel';
import CreateCarouselCaption from './ImageCarouselCaption';
import "bootstrap/dist/css/bootstrap.css";
import * as jQuery from 'jquery';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';

import { ISliderCarouselListItem, ISliderCarouselState } from './ISliderCarouselListItem';
import ImageCarouselWebPart from '../ImageCarouselWebPart';
import * as strings from 'ImageCarouselWebPartStrings';
import { Target } from './ImageCarouselEnums';


export default class ImageCarousel extends React.Component<IImageCarouselProps, ISliderCarouselState> {

  constructor(props: IImageCarouselProps) {
    super(props);
    this.state = {
      value: []
    }
  }

  private locales = {
    1025: 'ar-SA',
    1026: 'bg-BG',
    1027: 'ca-ES',
    1028: 'zh-TW',
    1029: 'cs-CZ',
    1030: 'da-DK',
    1031: 'de-DE',
    1032: 'el-GR',
    1033: 'en-US',
    1035: 'fi-FI',
    1036: 'fr-FR',
    1037: 'he-IL',
    1038: 'hu-HU',
    1040: 'it-IT',
    1041: 'ja-JP',
    1042: 'ko-KR',
    1043: 'nl-NL',
    1044: 'nb-NO',
    1045: 'pl-PL',
    1046: 'pt-BR',
    1048: 'ro-RO',
    1049: 'ru-RU',
    1050: 'hr-HR',
    1051: 'sk-SK',
    1053: 'sv-SE',
    1054: 'th-TH',
    1055: 'tr-TR',
    1057: 'id-ID',
    1058: 'uk-UA',
    1060: 'sl-SI',
    1061: 'et-EE',
    1062: 'lv-LV',
    1063: 'lt-LT',
    1066: 'vi-VN',
    1068: 'az-Latn-AZ',
    1069: 'eu-ES',
    1071: 'mk-MK',
    1081: 'hi-IN',
    1086: 'ms-MY',
    1087: 'kk-KZ',
    1106: 'cy-GB',
    1110: 'gl-ES',
    1164: 'prs-AF',
    2052: 'zh-CN',
    2070: 'pt-PT',
    2108: 'ga-IE',
    3082: 'es-ES',
    5146: 'bs-Latn-BA',
    9242: 'sr-Latn-RS',
    10266: 'sr-Cyrl-RS',
  };

  componentDidUpdate(prevProps: Readonly<IImageCarouselProps>, prevState: Readonly<ISliderCarouselState>, snapshot?: any): void {
    if (((prevProps.listName !== this.props.listName) ||
      (prevProps.numberOfItems !== this.props.numberOfItems) ||
      (prevProps.order !== this.props.order) ||
      (prevProps.uiLcid !== this.props.uiLcid) ||
      (prevProps.pauseCarousel !== this.props.pauseCarousel) ||
      (prevProps.slideSpeed !== this.props.slideSpeed)
    ) && (!ImageCarousel.isStringEmptyOrNull(this.props.listName))) {
      this.getCarouselListContent();
    }
  }
  componentDidMount = () => {
    if (!ImageCarousel.isStringEmptyOrNull(this.props.listName)) {
      this.getCarouselListContent();
    }
  }

  private getCarouselListContent = () => {
    console.log('get Carousel Data Called');
    try {
      const sListName: string = escape(this.props.listName);
      const nTop: number = this.props.numberOfItems > 0 ? this.props.numberOfItems : 5;
      const sSelect: string = "$select=ImageURL,Title,Description,RedirectURL,Target";
      const sFilter: string = "$filter=(Language eq '0000') or (Language eq '" + this.props.uiLcid.toString() + "')";
      const sOrderByStatement: string = "$orderby=SortOrder " + (ImageCarousel.isStringEmptyOrNull(escape(this.props.order)) ? "asc" : escape(this.props.order));
      const sTopStatement: string = "$Top=" + nTop.toString();

      const requestUrl: string = `${this.props.absoluteURL}/_api/web/Lists/GetByTitle('${sListName}')/Items?` + sSelect  + '&' + sFilter + '&' + sTopStatement + '&' + sOrderByStatement;
      console.log("requestURL: " + requestUrl)
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

  public render(): React.ReactElement<IImageCarouselProps> {
    let collection = this.state.value;
    console.log('3. Render Event Called');
    console.log(collection);

    const {
      slideSpeed,
      pauseCarousel,
    } = this.props;

    if (this.needsConfirguration()) {
      return <div className="ms-Grid rootNeedConfiguration">
        <div className="ms-Grid-row" style={{ color: "#333" }}>
          <div className="ms-Grid-col ms-u-hiddenSm ms-u-md3"></div>
          <div className="ms-Grid-col ms-u-sm12 ms-u-md6" style={{ height: "100%", whiteSpace: "nowrap", textAlign: "center" }}>
            <i className="ms-fontSize-su ms-Icon ms-Icon--ThumbnailView" style={{ display: "inline-block", verticalAlign: "middle", whiteSpace: "normal" }}></i><span className="ms-fontWeight-light ms-fontSize-xxl" style={{ paddingLeft: "20px", display: "inline-block", verticalAlign: "middle", whiteSpace: "normal" }}>{strings.NeedConfigurationHeading}</span>
          </div>
          <div className="ms-Grid-col ms-u-hiddenSm ms-u-md3"></div>
        </div>
        <div className="ms-Grid-row" style={{ width: "65%", verticalAlign: "middle", margin: "0 auto", textAlign: "center" }}>
          <span style={{ color: "#666", fontSize: "17px", display: "inline-block", margin: "24px 0", fontWeight: 100 }}>{strings.ShowItemsFromSelectedList}</span>
        </div>
        <div className="ms-Grid-row"/>
      </div>;
    }
    else {

      return (
        <div className={styles.imageCarousel} >
          <Carousel pause={pauseCarousel ? 'hover' : false} interval={(slideSpeed * 1000)}>
            {
              collection.length > 0 && collection.map((data, index) => {
                if ((data.RedirectURL !== null) && (data.RedirectURL !== undefined)) {
                  return (
                    <Carousel.Item>
                      <a href={(data.RedirectURL !== null) ? escape(data.RedirectURL["Url"]) : ""}
                        title={(data.RedirectURL !== null) ? escape(data.RedirectURL["Description"]) : escape(data.RedirectURL["Url"])}
                        target={(data.Target)? Target.Blank: ImageCarousel.getUrlTarget(escape(data.Target))}>
                        <img
                          className="d-block w-100"
                          src={JSON.parse(data.ImageURL).serverRelativeUrl}
                          alt={ImageCarousel.isStringEmptyOrNull(data.Title) ? "" : escape(data.Title)}
                        />
                        <CreateCarouselCaption Title={(!ImageCarousel.isStringEmptyOrNull(data.Title)) ? data.Title : undefined}
                          Description={(!ImageCarousel.isStringEmptyOrNull(data.Description)) ? data.Description : undefined} />
                      </a>
                    </Carousel.Item>
                  )
                } else {
                  return (
                    <Carousel.Item>
                      <img
                        className="d-block w-100"
                        src={JSON.parse(data.ImageURL).serverRelativeUrl}
                        alt={ImageCarousel.isStringEmptyOrNull(data.Title) ? "" : escape(data.Title)}
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

  private needsConfirguration(): boolean {
    return ImageCarousel.isStringEmptyOrNull(escape(this.props.listName));
  }

  private static isStringEmptyOrNull(sString: string): boolean {
    return sString === undefined ||
      sString === null ||
      sString.length === 0;
  }
  private getLocaleId(localeName: string): number {
    const pos: number = (Object as any).values(this.locales).indexOf(localeName);
    if (pos > -1) {
      return parseInt(Object.keys(this.locales)[pos]);
    }
    else {
      return 0;
    }
  }

  private getLocaleName(localeId: number): string {
    const pos: number = Object.keys(this.locales).indexOf(localeId.toString());
    if (pos > -1) {
      return (Object as any).values(this.locales)[pos];
    }
    else {
      return '';
    }
  }
  /**
   * 
   * @param sTargetKey Datasource Target Field value 
   * @returns Returns 
   */
  private static getUrlTarget(sTarget: string): string {
    try {
      if (ImageCarousel.isStringEmptyOrNull(sTarget)) {
        return Target.Blank;
      } else {
        return Target[sTarget];
      }
    }
    catch {
      return Target.Blank;
    }
  }

}
