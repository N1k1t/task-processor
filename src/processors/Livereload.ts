import { TProcessorGenerator } from '../typings';

export type TLivereloadAction = 'reload' | 'inject'
export interface ILivereloadOptions {
	action?: TLivereloadAction
}

const handler: TProcessorGenerator<ILivereloadOptions> = () => async ({ useLivereload }, { action = 'reload' }) => {
	useLivereload(action);
}

export default handler
