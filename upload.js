import { handleUpload } from '@vercel/blob/client';
export default async function handler(req, res) {
  try {
    const json = await handleUpload({
      body: req.body, request: req,
      onBeforeGenerateToken: async (pathname) => {
        if (!/^uploads\/[\w.\-]+\.(stl|step|stp|3mf|obj|png|jpe?g|webp|pdf)$/i.test(pathname)) throw new Error('Tipo de archivo no permitido');
        return { maximumSizeInBytes: 100 * 1024 * 1024, addRandomSuffix: true };
      },
      onUploadCompleted: async () => {},
    });
    res.status(200).json(json);
  } catch (e) { res.status(400).json({ error: e.message }); }
}
