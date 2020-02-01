import App from "../../models/App"
import gathered from "../apps/gathered"
import scanula from "../apps/scanula"
import fourSquares from "../apps/four-squares"

export class AppsLoader {
  getApps(): App[] {
    return [gathered, scanula, fourSquares]
  }
}

const loader = new AppsLoader()

export default loader
