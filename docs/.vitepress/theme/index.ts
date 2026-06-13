import DefaultTheme from 'vitepress/theme'
import HomePage from './components/HomePage.vue'
import MetricBadge from './components/MetricBadge.vue'
import SourceProjectCard from './components/SourceProjectCard.vue'
import TrackCard from './components/TrackCard.vue'
import './styles/tokens.css'
import './styles/base.css'
import './styles/vitepress.css'
import './styles/components.css'
import './styles/home.css'
import './styles/content.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('HomePage', HomePage)
    app.component('TrackCard', TrackCard)
    app.component('SourceProjectCard', SourceProjectCard)
    app.component('MetricBadge', MetricBadge)
  }
}
