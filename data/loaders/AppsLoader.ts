import App from '../../models/App'
import gathered from '../apps/gathered'

export class AppsLoader {

  getApps(): App[] {
    return [
      gathered,
    ]
  }

}

const loader = new AppsLoader()

export default loader
