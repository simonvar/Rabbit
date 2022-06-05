import 'package:flame/components.dart';
import 'package:flame/collisions.dart';

class WorldHitbox extends PositionComponent with HasGameRef {
  @override
  Future<void> onLoad() async {
    add(RectangleHitbox());
  }
}
