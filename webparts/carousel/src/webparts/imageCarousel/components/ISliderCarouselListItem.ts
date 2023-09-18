
export interface ISliderCarouselListItem{
  Title: string;
  Description : string;
  ImageURL: string;
  RedirectURL?:[];
  Target?:string;
}
export interface ISliderCarouselState { 
  value : ISliderCarouselListItem [];
}