import { Constants } from 'expo';

function getSlug() {
  const { manifest: { slug } } = Constants;
  return slug;
}
export default getSlug;
