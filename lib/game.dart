import 'dart:developer' as developer;
import 'dart:ui';
import 'package:flame/game.dart';
import 'package:flame/components.dart';
import 'package:flame/input.dart';
import 'components/world.dart';
import 'components/rabbit.dart';
import './components/world/grass.dart';

class RabbitGame extends FlameGame
    with ScrollDetector, ScaleDetector, HasTappables {
  static const zoomPerScrollUnit = 0.02;
  final Vector2 viewportResolution;
  double startZoom = 1.0;

  final World _world = World();
  final Rabbit _rabbit = Rabbit();

  RabbitGame({
    required this.viewportResolution,
  });

  @override
  Color backgroundColor() {
    return Color.fromRGBO(139, 203, 183, 1);
  }

  @override
  Future<void> onLoad() async {
    camera.viewport = FixedResolutionViewport(viewportResolution);
    camera.setRelativeOffset(Anchor.center);
    camera.speed = 100;

    await add(_world);
    await add(_rabbit);

    _rabbit.position = camera.position;
  }

  @override
  void onScroll(PointerScrollInfo info) {
    camera.zoom += info.scrollDelta.game.y.sign * zoomPerScrollUnit;
    clampZoom();
  }

  @override
  void onScaleStart(_) {
    startZoom = camera.zoom;
  }

  @override
  void onScaleUpdate(ScaleUpdateInfo info) {
    final currentScale = info.scale.global;
    if (!currentScale.isIdentity()) {
      camera.zoom = startZoom * currentScale.y;
      clampZoom();
    } else {
      camera.translateBy(-info.delta.game);
      camera.snap();
    }
  }

  void clampZoom() {
    camera.zoom = camera.zoom.clamp(0.05, 3.0);
  }
}
