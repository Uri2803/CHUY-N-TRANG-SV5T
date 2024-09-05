import { extname } from 'path';

export const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|pdf|docx|doc|zip)$/)) {
    return callback(new Error('Không chấp nhận loại file này'), false);
  }
  callback(null, true);
};
export const editFileName = (
  req,
  file,
  callback: (e: Error, filename: string) => void,
): void => {
  // console.log('req: ', req.params);
  console.log(file)
  const name = file.originalname.split('.')[0];
  const fileExtName = extname(file.originalname);
  // const randomName = Array(4)
  //   .fill(null)
  //   .map(() => Math.round(Math.random() * 16).toString())
  //   .join('');

  callback(null, `${name}${fileExtName}`);
};

