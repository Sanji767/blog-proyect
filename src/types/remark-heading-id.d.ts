declare module "remark-heading-id" {
  import type { Plugin } from "unified";

  // El plugin acepta opciones opcionales y retorna un plugin válido para remark
  const remarkHeadingId: Plugin<any[], any>;
  export default remarkHeadingId;
}
