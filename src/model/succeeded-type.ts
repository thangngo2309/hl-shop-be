import { ImageType } from "../enum/imagetype.enum";

export type SucceededType = {
      originalname: string;
      mimetype: string;
      size: number;
      type: ImageType;
      entity_id: number;
      storage_path: string;
};