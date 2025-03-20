import { z, ZodError } from "zod";
import { CustomError } from "../Error/Error";

export class Validator {
  private schema: z.ZodTypeAny;
  private data: any;

  constructor(schema: z.ZodTypeAny, data: any) {
    this.schema = schema;
    this.data = data;
  }

  private FormatError(errors: z.ZodIssue[]) {
    return errors
      .map((err) => {
        const path = err.path.join(" > ");
        return `Error in field '${path}': ${err.message}`;
      })
      .join("\n");
  }


  public validate() {
    try {
      this.schema.parse(this.data);
      console.log("Validation successful");
    } catch (error) {
      if (error instanceof ZodError  ) {
        console.error("Validation failed :", error.errors );
        throw new CustomError(this.FormatError(error.errors ), 403);
      }else if(error instanceof Error ){
        console.error("Validation failed:", error );
        throw new CustomError(error.message , 403);
      } 
      else {
        console.error("An unknown error occurred during validation.");
      }
    }
  }
}
