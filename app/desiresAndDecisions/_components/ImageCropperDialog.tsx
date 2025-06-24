'use client'

import { useState, useRef, useEffect } from 'react';
import { 
    Cropper, 
    ImageRestriction,
    CropperRef
} from 'react-advanced-cropper'
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/components/hooks/use-toast';
import { Slider } from '@/components/ui/slider';
import { RotateCw } from 'lucide-react';
import 'react-advanced-cropper/dist/style.css';

interface ImageCropperDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    imageFile: File | null;
    onCropComplete: (croppedImage: Blob) => void;
    aspect?: number;
}

export function ImageCropperDialog({
    open,
    onOpenChange,
    imageFile,
    onCropComplete,
    aspect = 16/9,
}: ImageCropperDialogProps) {
    const cropperRef = useRef<CropperRef>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [zoom, setZoom] = useState(1);
    const { toast } = useToast();

    const applyTransforms = () => {
        if (cropperRef.current && imageFile) {
            const state = cropperRef.current.getState();
            if (state) {
                // Create a new state object to avoid mutating the original state directly
                let newState = {
                    ...state,
                    transforms: {
                        ...state.transforms,
                        rotate: rotation
                    }
                };

                // Apply zoom manually by adjusting coordinates
                if (zoom !== 1) {
                    // Ensure coordinates are not undefined before accessing properties
                    if (!state.coordinates) return;

                    newState.coordinates = {
                        ...state.coordinates,
                        width: state.coordinates.width * zoom,
                        height: state.coordinates.height * zoom
                    };
                }
                
                cropperRef.current.setState(newState as any); // Cast to any to bypass type checking for now
            }
        }
    };

    const handleSave = async () => {
        applyTransforms(); // Aplica as transformações antes de salvar
        
        if (!cropperRef.current || !imageFile) {
            toast({
                title: "Erro",
                description: "Por favor, ajuste o recorte da imagem antes de salvar.",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);
        try {
            const canvas = cropperRef.current.getCanvas();
            if (!canvas) {
                throw new Error('Failed to get canvas');
            }

            canvas.toBlob((blob) => {
                if (!blob) {
                    throw new Error('Canvas is empty');
                }
                onCropComplete(blob);
                onOpenChange(false);
            }, 'image/jpeg', 0.9);
        } catch (error) {
            toast({
                title: "Erro",
                description: "Ocorreu um erro ao processar a imagem.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        onOpenChange(false);
    };

    const handleRotate = () => {
        setRotation((prev) => {
            const newRotation = (prev + 90) % 360;
            return newRotation;
        });
    };

    const handleZoomChange = (value: number[]) => {
        setZoom(value[0]);
    };

    const handleReset = () => {
        setRotation(0);
        setZoom(1);
        cropperRef.current?.reset();
    };

    // Aplica transformações quando mudam
    useEffect(() => {
        applyTransforms();
    }, [rotation, zoom, imageFile]); // Add imageFile as a dependency

    if (!imageFile) {
        return null;
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-[90vw] w-[800px] h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Editar imagem</DialogTitle>
                </DialogHeader>
                
                <div className="flex-1 overflow-hidden flex flex-col gap-4">
                    <div className="h-full bg-gray-100 rounded-lg p-4">
                        <Cropper
                            ref={cropperRef}
                            src={URL.createObjectURL(imageFile)}
                            className="h-full cropper"
                            stencilProps={{
                                aspectRatio: aspect,
                                movable: false,
                                resizable: false,
                            }}
                            imageRestriction={ImageRestriction.stencil}
                        />
                    </div>

                    {/* <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium">
                                Zoom ({Math.round(zoom * 100)}%)
                            </label>
                            <Slider
                                defaultValue={[1]}
                                min={0.5}
                                max={3}
                                step={0.1}
                                onValueChange={handleZoomChange}
                                value={[zoom]}
                            />
                        </div>

                        <div className="flex items-end">
                            <Button variant="outline" onClick={handleRotate} className="gap-2">
                                <RotateCw className="h-4 w-4" />
                                Girar 90°
                            </Button>
                        </div>
                    </div> */}
                </div>

                <DialogFooter className="sm:justify-between mt-4">
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={handleReset}>
                            Redefinir
                        </Button>
                        <Button variant="outline" onClick={handleClose}>
                            Cancelar
                        </Button>
                    </div>
                    <Button onClick={handleSave} disabled={isLoading}>
                        {isLoading ? "Aplicando..." : "Aplicar"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}