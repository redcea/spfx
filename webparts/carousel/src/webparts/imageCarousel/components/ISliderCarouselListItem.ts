
export interface ISliderCarouselListItem{
  Title: string;
  Description : string;
  ImageURL: string;
  RedirectURL?:[]
}
export interface ISliderCarouselState { 
  value : ISliderCarouselListItem [];
}