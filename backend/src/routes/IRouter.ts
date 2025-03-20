import { Router } from "express";

export interface IRouter {
  router: Router;
  routerSubPath: string;
  registerRoutes(): void;
}
