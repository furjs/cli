import log from 'npmlog';
import args from './args';

log.enableColor();
log.enableUnicode();
log.enableProgress();

log.level = (args.verbose || args.v || false) ? 'silly' : 'info';

export default log;