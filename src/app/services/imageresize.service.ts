import { Observable ,  Subscriber } from 'rxjs';
import { Injectable, NgZone } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})

export class ImageCompressorService {

// globals
private _currentFile : File ;
private _currentImage : ICompressedImage = {} ;

// Constructor
constructor( private sanitizer : DomSanitizer , private _zone : NgZone) {

}

// FileReader Onload callback
readerOnload(observer : Subscriber<ICompressedImage>)  {
 return (progressEvent : ProgressEvent) => {
  const img = new Image();
  img.src = (progressEvent.target as any).result;
  img.onload = this.imageOnload(img , observer);
}
}

// Image Onload callback
 imageOnload(image : HTMLImageElement , observer : Subscriber<ICompressedImage>) {
  return () => {
  const canvas = document.createElement('canvas');
  canvas.width = 100;
  canvas.height = 100;
  const context = <CanvasRenderingContext2D>canvas.getContext('2d');
  context.drawImage(image , 0 , 0 , 100 , 100);
  this.toICompressedImage(context , observer);
}}

// Emit CompressedImage
toICompressedImage(context : CanvasRenderingContext2D , observer : Subscriber<ICompressedImage> ) {
  context.canvas.toBlob(
    (blob) => {
      this._currentImage.blob = blob ;
      this._currentImage.image = new File([blob] , this._currentFile.name , {type : 'image/jpeg', lastModified : Date.now()} );
      this._currentImage.imgUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob));
      this._currentImage.name = this._currentFile.name ;
      this._zone.run(() => {
        observer.next(this._currentImage);
        observer.complete();
      })

    } ,
    'image/jpeg' ,
    1
  );
}

//  Compress function
 compress(file : File) : Observable<ICompressedImage> {
   this._currentFile = file ;
   return new Observable<ICompressedImage>(
     observer => {
       this._zone.runOutsideAngular(() => {
        const currentFile = file;

        const reader = new FileReader();
        reader.readAsDataURL(currentFile);
        reader.onload = this.readerOnload(observer);
       })

     }
   );
 }
}

// Image Data Interface
export interface ICompressedImage {
  name? : string;
  image? : File ;
  blob? : Blob ;
  imgUrl? : SafeUrl ;
}