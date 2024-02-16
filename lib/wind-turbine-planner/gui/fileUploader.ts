import { Application } from '@daign/2d-graphics';

import { BackgroundImage } from '../controls';

/**
 * File uploader class.
 */
export class FileUploader {
  /**
   * Constructor.
   * @param application - The corresponding application.
   * @param inputId - The id of the file input element.
   * @param backgroundImageObject - Background image control object that is added to the graphic.
   */
  public constructor(
    private application: Application,
    private inputId: string,
    private backgroundImageObject: BackgroundImage
  ) {
    const fileInput = document.getElementById( this.inputId ) as HTMLInputElement;

    fileInput.addEventListener( 'change', ( event: any ): void => {
      const selectedFile = ( event.target as HTMLInputElement ).files![ 0 ];

      if ( selectedFile ) {
        const reader = new FileReader();

        // When the file is loaded, read image data as uri and set to background image object.
        reader.onload = ( e: any ): void => {
          const imageDataUri = ( e.target as FileReader ).result as string;
          this.backgroundImageObject.imageData = imageDataUri;

          this.application.selectionManager.setSelection( this.backgroundImageObject, null );
          this.application.redraw();
        };

        reader.readAsDataURL( selectedFile );
      }
    } );
  }

  /**
   * Open file upload dialog by activating the hidden file input element.
   */
  public triggerFileUpload(): void {
    const fileInput = document.getElementById( this.inputId ) as HTMLInputElement;
    fileInput.click();
  }
}
